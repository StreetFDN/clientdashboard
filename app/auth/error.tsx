'use client'

export default function AuthError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Authentication Error</h2>
        <p className="text-gray-600 mb-6">{error.message || 'An error occurred during authentication'}</p>
        <button
          onClick={reset}
          className="w-full bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 mb-2"
        >
          Try again
        </button>
        <a
          href="/auth/signin"
          className="block w-full text-center bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300"
        >
          Go to Sign In
        </a>
      </div>
    </div>
  )
}

