import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

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

    const { bookingId, action = 'open' } = await req.json();

    // Verify that the booking belongs to the authenticated user
    const { data: booking, error: bookingError } = await supabaseServiceRole
      .from('bookings')
      .select('*')
      .eq('id', bookingId)
      .eq('user_id', user.id)
      .eq('payment_status', 'paid')
      .eq('status', 'confirmed')
      .single();

    if (bookingError || !booking) {
      throw new Error('Booking not found or not authorized');
    }

    // Check if booking is currently active
    const now = new Date();
    const startDate = new Date(booking.start_date);
    const endDate = new Date(booking.end_date);

    if (now < startDate || now > endDate) {
      throw new Error('Booking is not currently active');
    }

    // Find available locker for this product/location
    const { data: lockers, error: lockersError } = await supabaseServiceRole
      .from('lockers')
      .select('*')
      .eq('status', 'closed')
      .limit(1);

    if (lockersError || !lockers || lockers.length === 0) {
      throw new Error('No available lockers found');
    }

    const locker = lockers[0];

    // Call Ajax integration to open the physical locker
    const ajaxResponse = await supabaseServiceRole.functions.invoke('ajax-integration', {
      body: {
        action: 'open_relay',
        hub_id: locker.hub_id,
        relay_id: locker.relay_id
      }
    });

    if (!ajaxResponse.data?.success) {
      throw new Error('Failed to open physical locker');
    }

    // Log the locker open event
    const { error: logError } = await supabaseServiceRole
      .from('open_logs')
      .insert({
        user_id: user.id,
        locker_id: locker.id,
        action: 'customer_open',
        meta: {
          booking_id: bookingId,
          product_name: booking.product_name,
          location: booking.location,
          hub_id: locker.hub_id,
          relay_id: locker.relay_id,
          timestamp: new Date().toISOString()
        }
      });

    if (logError) {
      console.error('Error logging locker open:', logError);
    }

    console.log(`Smart locker opened for booking ${bookingId} by user ${user.id}`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Smart locker opened successfully',
        booking_id: bookingId,
        locker_id: locker.id,
        locker_name: locker.name
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('Error in smart-locker-control function:', error);
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