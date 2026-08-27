UPDATE authors 
SET name = 'SHAH  FAIZ',
    bio = 'Founder & systems builder. Engineering sovereign digital systems from first principles, built without institutional backing or venture safety nets.',
    date_of_birth = NULL,
    social_links = '{"twitter":"https://x.com/MrUniqers","instagram":"https://www.instagram.com/mr.uniqers/","youtube":"https://youtube.com/@channel","linkedin":"https://www.linkedin.com/in/iamrealshahfaiz/","github":"https://github.com/mruniqers","discord":"https://discord.com/invite/introlic"}'::jsonb,
    updated_at = NOW();

UPDATE projects 
SET author = 'SHAH  FAIZ' 
WHERE author ILIKE '%faiz%';
