import { Button } from '@web-client/dawson-ui/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@web-client/dawson-ui/ui/tabs"
import { BigHeader } from '@web-client/views/BigHeader';
import { Alert, AlertDescription, AlertTitle } from "@web-client/dawson-ui/ui/alert"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@web-client/dawson-ui/ui/card"

import React from 'react';
import { CheckCircle2Icon } from 'lucide-react';
import { Label } from '@web-client/dawson-ui/ui/label';
import { Input } from '@web-client/dawson-ui/ui/input';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export const DawsonLibrary = () => {
  return (
    <>
      <BigHeader text="Dawson Library" />
      <div className="card margin-2 padding-2">
        <h2 className="tw:text-3xl">Button</h2>
        <button className="tw:bg-blue-500">
          Test Button with Tailwind
        </button>
        <Button variant={"default"}><FontAwesomeIcon
          className="fa:margin-right-1"
          icon={'search'}
          size="1x"
        />Button with Shadcn</Button>

        <Tabs defaultValue="account" className="w-[400px]">
          <TabsList>
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="password">Password</TabsTrigger>
          </TabsList>
          <TabsContent value="account">Make changes to your account here.</TabsContent>
          <TabsContent value="password">Change your password here.</TabsContent>
        </Tabs>

        <Card>
          <CardHeader>
            <CardTitle>Card Title</CardTitle>
            <CardDescription>Card Description</CardDescription>
            <CardAction>Card Action</CardAction>
          </CardHeader>
          <CardContent>
            <p>Card Content</p>
          </CardContent>
          <CardFooter>
            <p>Card Footer</p>
          </CardFooter>
        </Card>


        <div className="tw:max-w-2xl tw:mx-auto">
          <Card className="tw:w-full tw:max-w-sm">
            <CardHeader>
              <CardTitle>Login to your account</CardTitle>
              <CardDescription>
                Enter your email below to login to your account
              </CardDescription>
              <CardAction>
                <Button variant="link">Sign Up</Button>
              </CardAction>
            </CardHeader>
            <CardContent>
              <form>
                <div className="tw:flex tw:flex-col tw:gap-6">
                  <div className="tw:grid tw:gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="m@example.com"
                      required
                    />
                  </div>
                  <div className="tw:grid tw:gap-2">
                    <div className="tw:flex tw:items-center">
                      <Label htmlFor="password">Password</Label>
                      <a
                        href="#"
                        className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                      >
                        Forgot your password?
                      </a>
                    </div>
                    <Input id="password" type="password" required />
                  </div>
                </div>
              </form>
            </CardContent>
            <CardFooter className="tw:flex-col tw:gap-2">
              <Button type="submit" className="tw:w-full">
                Login
              </Button>
              <Button variant="outline" className="tw:w-full">
                Login with Google
              </Button>
            </CardFooter>
          </Card>
        </div>

        <Alert>
          <CheckCircle2Icon />
          <AlertTitle>Success! Your changes have been saved</AlertTitle>
          <AlertDescription>
            This is an alert with icon, title and description.
          </AlertDescription>
        </Alert>
      </div>
    </>
  );
};
