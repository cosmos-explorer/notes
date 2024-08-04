import { signin } from "@/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ReloadIcon } from "@radix-ui/react-icons"
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useToast } from "../ui/use-toast"
import { useAuth } from "@/context/auth-context"

export function SignIn() {
  const {toast} = useToast()
  const navigate = useNavigate();
  const {signin: authenticate} = useAuth();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  async function onSubmit(event: React.SyntheticEvent) {
    event.preventDefault()
    setIsLoading(true)

    try {
      const response = await signin({username, password});

      toast({
        title: "Login successfully"
      })

      authenticate(response.access_token);
      navigate("/");
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Login failed",
        description: "Please check your credentials and try again.",
      })
      setIsLoading(false);
    }
  }

  return (
    <>
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          Sign In
        </h1>
        <p className="text-sm text-muted-foreground">
          Enter your email below to login to your account
        </p>
      </div>
      <div className="grid gap-6">
        <form onSubmit={ onSubmit }>
          <div className="grid gap-5">
            <div className="grid gap-1">
              <Label htmlFor="email">
                Email
              </Label>
              <Input
                id="email"
                placeholder="name@example.com"
                type="email"
                required
                disabled={ isLoading }
                onChange={ (e) => setUsername(e.target.value) }
              />

            </div>
            <div className="grid gap-1">
              <Label htmlFor="password">
                Password
              </Label>
              <Input
                id="password"
                placeholder="Password"
                type="password"
                required
                disabled={ isLoading }
                onChange={ (e) => setPassword(e.target.value) }
              />
            </div>
            <Button disabled={ isLoading }>
              { isLoading && (
                <ReloadIcon className="mr-2 h-4 w-4 animate-spin"/>
              ) }
              Sign In
            </Button>
          </div>
          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{ " " }
            <Link to="/signup" className="underline">
              Sign up
            </Link>
          </div>
        </form>
      </div>
    </>
  )
}
