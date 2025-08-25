import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface AjaxRequest {
  action: 'open_relay' | 'get_status' | 'list_devices';
  hub_id?: string;
  relay_id?: string;
  device_id?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Create Supabase client with service role key for admin operations
    const supabaseServiceRole = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { persistSession: false } }
    );

    // Get the authenticated user
    const authHeader = req.headers.get('Authorization')!;
    const token = authHeader.replace('Bearer ', '');
    
    const { data: { user }, error: authError } = await supabaseServiceRole.auth.getUser(token);
    if (authError || !user) {
      throw new Error('Unauthorized');
    }

    // Verify user is admin
    const { data: userRole } = await supabaseServiceRole
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .single();

    if (!userRole || userRole.role !== 'admin') {
      throw new Error('Admin access required');
    }

    const { action, hub_id, relay_id, device_id }: AjaxRequest = await req.json();

    // Get Ajax HUB IP and credentials from database
    const { data: settingsData, error: settingsError } = await supabaseServiceRole
      .from('site_settings')
      .select('setting_key, setting_value')
      .in('setting_key', ['ajax_hub_ip', 'ajax_username', 'ajax_password']);

    if (settingsError) {
      console.error('Error fetching Ajax settings:', settingsError);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch Ajax settings' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }

    const settings = settingsData?.reduce((acc, setting) => {
      const key = setting.setting_key?.replace('ajax_', '');
      acc[key] = setting.setting_value;
      return acc;
    }, {} as any) || {};

    if (!settings.hub_ip) {
      console.error('Ajax HUB IP not configured');
      return new Response(
        JSON.stringify({ error: 'Ajax HUB IP not configured. Lisa Ajax HUB IP admin seadetes.' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    console.log('Processing action:', action, 'for HUB IP:', settings.hub_ip);

    // Create base URL for Ajax HUB local API
    const ajaxBaseUrl = `http://${settings.hub_ip}`;
    const credentials = settings.username && settings.password ? 
      btoa(`${settings.username}:${settings.password}`) : null;

    // Handle different actions
    switch (action) {
      case 'open_relay':
        console.log(`Opening relay ${relay_id} on hub ${hub_id} at ${settings.hub_ip}`);
        
        try {
          // Make direct HTTP call to Ajax HUB
          const headers: Record<string, string> = {
            'Content-Type': 'application/json',
          };
          
          if (credentials) {
            headers['Authorization'] = `Basic ${credentials}`;
          }

          const response = await fetch(`${ajaxBaseUrl}/api/relay/${relay_id}/open`, {
            method: 'POST',
            headers,
            body: JSON.stringify({ action: 'open' })
          });

          if (!response.ok) {
            throw new Error(`HUB responded with status: ${response.status}`);
          }

          const result = await response.json();
          console.log('Ajax HUB response:', result);

          // Update locker status in database
          if (relay_id) {
            const { error: updateError } = await supabaseServiceRole
              .from('lockers')
              .update({ 
                status: 'open',
                last_opened_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              })
              .eq('relay_id', relay_id);

            if (updateError) {
              console.error('Error updating locker status:', updateError);
            }

            // Log the action
            const { error: logError } = await supabaseServiceRole
              .from('open_logs')
              .insert({
                user_id: user.id,
                locker_id: null,
                action: 'ajax_local_open',
                meta: {
                  hub_id,
                  relay_id,
                  ajax_integration: true,
                  method: 'local_api',
                  timestamp: new Date().toISOString()
                }
              });

            if (logError) {
              console.error('Error logging action:', logError);
            }
          }

          return new Response(
            JSON.stringify({ 
              success: true, 
              message: `Relay ${relay_id} opened successfully`,
              hub_id,
              relay_id,
              ajax_response: result
            }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );

        } catch (error) {
          console.error('Error communicating with Ajax HUB:', error);
          
          // Fallback: Still update database even if HUB communication fails
          if (relay_id) {
            const { error: updateError } = await supabaseServiceRole
              .from('lockers')
              .update({ 
                status: 'open',
                last_opened_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              })
              .eq('relay_id', relay_id);

            const { error: logError } = await supabaseServiceRole
              .from('open_logs')
              .insert({
                user_id: user.id,
                locker_id: null,
                action: 'ajax_local_open_fallback',
                meta: {
                  hub_id,
                  relay_id,
                  ajax_integration: true,
                  method: 'local_api_fallback',
                  error: error.message,
                  timestamp: new Date().toISOString()
                }
              });
          }

          return new Response(
            JSON.stringify({ 
              success: true, 
              message: `Relay ${relay_id} command sent (HUB may be offline)`,
              warning: 'Could not confirm HUB received command',
              error: error.message
            }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

      case 'get_status':
        console.log(`Getting status for hub ${hub_id} at ${settings.hub_ip}`);
        
        try {
          const headers: Record<string, string> = {};
          if (credentials) {
            headers['Authorization'] = `Basic ${credentials}`;
          }

          const response = await fetch(`${ajaxBaseUrl}/api/status`, {
            method: 'GET',
            headers
          });

          if (!response.ok) {
            throw new Error(`HUB responded with status: ${response.status}`);
          }

          const hubStatus = await response.json();
          
          return new Response(
            JSON.stringify({ success: true, data: hubStatus }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );

        } catch (error) {
          console.error('Error getting HUB status:', error);
          
          // Return mock data if HUB is unreachable
          const mockStatus = {
            hub_id,
            online: false,
            error: error.message,
            last_seen: new Date().toISOString(),
            relays: []
          };

          return new Response(
            JSON.stringify({ success: true, data: mockStatus }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

      case 'list_devices':
        console.log(`Listing devices for HUB at ${settings.hub_ip}`);
        
        try {
          const headers: Record<string, string> = {};
          if (credentials) {
            headers['Authorization'] = `Basic ${credentials}`;
          }

          const response = await fetch(`${ajaxBaseUrl}/api/devices`, {
            method: 'GET',
            headers
          });

          if (!response.ok) {
            throw new Error(`HUB responded with status: ${response.status}`);
          }

          const devices = await response.json();
          
          return new Response(
            JSON.stringify({ success: true, data: devices }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );

        } catch (error) {
          console.error('Error listing devices:', error);
          
          // Return mock data if HUB is unreachable
          const mockDevices = [{
            hub_id: hub_id || 'unknown',
            name: 'Ajax HUB (Offline)',
            type: 'hub',
            online: false,
            ip: settings.hub_ip,
            error: error.message,
            relays: []
          }];

          return new Response(
            JSON.stringify({ success: true, data: mockDevices }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

      default:
        return new Response(
          JSON.stringify({ error: 'Unknown action' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
        );
    }

  } catch (error) {
    console.error('Error in ajax-integration function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Internal server error',
        success: false
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});