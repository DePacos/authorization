import { Button, Heading, Html, Link, Text, Body, Tailwind } from '@react-email/components';
import * as React from 'react';

export const ConfirmationTemplate = (link: string) => {
  return (
    <Tailwind>
      <Html>
        <Body className={'text-center'}>
          <Heading>Email confirmation</Heading>
          <Text>Hello, please click here to confirm your email.</Text>
          <Button>
            <Link href={link}>Follow to link</Link>
          </Button>
          <Text>Link is valid for an hour, if you did not request confirmation, ignore this message.</Text>
        </Body>
      </Html>
    </Tailwind>
  )
}