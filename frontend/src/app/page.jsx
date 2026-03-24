export default function Home() {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <div className="text-center space-y-6">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
            Kongu Connect
          </h1>
          <p className="text-slate-400">
            Smart campus communication platform
          </p>
  
          <div className="flex gap-4 justify-center">
            <a
              href="/login"
              className="px-6 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 transition"
            >
              Login
            </a>
  
            <a
              href="/register"
              className="px-6 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-600 transition"
            >
              Register
            </a>
          </div>
        </div>
      </main>
    );
  }