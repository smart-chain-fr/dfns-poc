import { useRouter } from "next/router"
import { ToastContainer, toast } from 'react-toastify'
import Link from 'next/link'

export default function LoginForm() {
  const router = useRouter()

  // Handles the submit event on form submit.
  const handleLogin = async (event: any) => {
    // Stop the form from submitting and refreshing the page.
    event.preventDefault()

    // Get data from the form.
    const data = {
      username: event.target.username.value,
    }

    // Send the data to the server in JSON format.

    // API endpoint where we send form data.
    const endpoint = '/api/login'

    // Form the request for sending data to the server.
    const options = {
      // The method is POST because we are sending data.
      method: 'POST',
      // Tell the server we're sending JSON.
      headers: {
        'Content-Type': 'application/json',
      },
      // Body of the request is the JSON data we created above.
      body: JSON.stringify(data),
    }

    // Send the form data to our forms API on Vercel and get a response.
    fetch(endpoint, options).then(async (response) => {
      const token = (await response.json()).token
      localStorage.setItem('access_key', token)

      router.push("/")
    }).catch((error) => {
      toast.error("User not registered.")

      router.push("/register")
    })
  }

  return (
    <div>
      <ToastContainer />

      <form onSubmit={handleLogin}>
        <label htmlFor="username">Username</label>
        <input type="text" id="username" name="username" required />

        <button type="submit">Login</button>
      </form>
      Click <Link href="/register">here</Link> to register
    </div>
  )
}
