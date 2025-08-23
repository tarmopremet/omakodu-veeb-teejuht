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

    const { bookingId } = await req.json();

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

    // Log the locker open event
    const { error: logError } = await supabaseServiceRole
      .from('open_logs')
      .insert({
        user_id: user.id,
        locker_id: 1, // This would come from booking data in real implementation
        action: 'open',
        meta: {
          booking_id: bookingId,
          product_name: booking.product_name,
          location: booking.location
        }
      });

    if (logError) {
      console.error('Error logging locker open:', logError);
    }

    // In a real implementation, this would send a signal to the physical locker
    // For now, we'll just return success
    console.log(`Opening locker for booking ${bookingId} by user ${user.id}`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Locker opened successfully',
        booking_id: bookingId 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('Error in open-locker function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Internal server error' 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});