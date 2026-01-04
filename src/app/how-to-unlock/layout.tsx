
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'How to Unlock Your Content',
  description: 'Step-by-step guides on how to access your purchased course materials through direct orders or by using an unlock key.',
};

export default function HowToUnlockLayout({
    children,
  }: {
    children: React.ReactNode
  }) {
    return <>{children}</>
  }
