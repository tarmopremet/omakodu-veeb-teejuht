-- Reset password for the test user by updating auth.users directly
-- This is only for development/testing purposes
UPDATE auth.users 
SET encrypted_password = crypt('TereEestimaa1212', gen_salt('bf'))
WHERE email = 'tarmo.premet@gmail.com';