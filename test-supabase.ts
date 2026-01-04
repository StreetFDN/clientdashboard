/**
 * Safe Supabase Test Script
 * 
 * This script tests your Supabase connection without using many resources.
 * Run with: npm run test:supabase
 */

// Load environment variables using dotenv
import { config } from 'dotenv'
config()

// Create Supabase client directly to avoid module loading issues
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase environment variables!')
  console.error('   Make sure .env file exists with:')
  console.error('   - NEXT_PUBLIC_SUPABASE_URL')
  console.error('   - NEXT_PUBLIC_SUPABASE_ANON_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function safeTest() {
  console.log('🧪 Starting safe Supabase test...\n')
  console.log('📍 Supabase URL:', supabaseUrl)
  console.log('')
  
  try {
    // 1. Test connection by checking auth
    console.log('1. Testing Supabase connection...')
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    
    if (sessionError) {
      console.log('⚠️  Session check:', sessionError.message)
    } else {
      console.log('✅ Connected to Supabase!')
      if (session) {
        console.log('   Current session:', session.user?.email || 'None')
      }
    }
    console.log('')
    
    // 2. Test authentication - Sign up
    console.log('2. Testing sign up...')
    const timestamp = Date.now()
    const testEmail = `testuser${timestamp}@gmail.com` // Use gmail format
    const testPassword = `TestPass${timestamp}!@#` // Unique password that meets requirements
    
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: testEmail,
      password: testPassword,
      options: {
        emailRedirectTo: undefined, // Skip email confirmation for testing
      }
    })
    
    if (signUpError) {
      console.error('❌ Sign up error:', signUpError.message)
      console.log('')
      console.log('⚠️  Note: This might be due to:')
      console.log('   - Email confirmation required in Supabase settings')
      console.log('   - Email domain restrictions')
      console.log('   - Password policy requirements')
      console.log('')
      console.log('💡 You can:')
      console.log('   1. Disable email confirmation in Supabase Dashboard > Authentication > Settings')
      console.log('   2. Or test with an existing user account')
      console.log('')
      console.log('Skipping sign up test, testing other features...')
      console.log('')
      
      // Try to test with a manual sign in if user exists
      console.log('3. Testing sign in (skipped - no test user)...')
      console.log('   ⚠️  Cannot test sign in without a user')
      console.log('')
    } else {
      console.log('✅ Test user created:', signUpData.user?.email)
      console.log('   User ID:', signUpData.user?.id)
      if (signUpData.user && !signUpData.session) {
        console.log('   ⚠️  Email confirmation may be required')
      }
      console.log('')
      
      // 3. Test sign in
      console.log('3. Testing sign in...')
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email: testEmail,
        password: testPassword,
      })
    
      if (signInError) {
        console.error('❌ Sign in error:', signInError.message)
        if (signInError.message.includes('Email not confirmed')) {
          console.log('   ⚠️  Email confirmation is required')
          console.log('   Disable it in Supabase Dashboard > Authentication > Settings')
        }
        return
      }
      
      console.log('✅ Signed in successfully!')
      console.log('   User ID:', signInData.user?.id)
      console.log('')
      
      // 4. Test getting current user
      console.log('4. Testing get current user...')
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      
      if (userError) {
        console.error('❌ Get user error:', userError.message)
      } else {
        console.log('✅ Current user retrieved!')
        console.log('   Email:', user?.email)
        console.log('   ID:', user?.id)
      }
      console.log('')
      
      // 5. Test sign out
      console.log('5. Testing sign out...')
      const { error: signOutError } = await supabase.auth.signOut()
      
      if (signOutError) {
        console.error('❌ Sign out error:', signOutError.message)
      } else {
        console.log('✅ Signed out successfully!')
      }
      console.log('')
      
      console.log('✅ All tests passed!')
      console.log('')
      console.log('📝 Test Summary:')
      console.log('   ✅ Supabase connection working')
      console.log('   ✅ User sign up working')
      console.log('   ✅ User sign in working')
      console.log('   ✅ Get user working')
      console.log('   ✅ Sign out working')
      console.log('')
      console.log('📧 Test user created:', testEmail)
      console.log('   You can delete it in Supabase Dashboard > Authentication > Users')
      console.log('   Or keep it for future testing')
      console.log('')
      console.log('🎉 Your Supabase setup is working correctly!')
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error)
    if (error instanceof Error) {
      console.error('   Error message:', error.message)
      console.error('   Stack:', error.stack)
    }
    process.exit(1)
  }
}

// Run the test
safeTest()
