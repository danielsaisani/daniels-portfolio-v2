import { auth } from '@/app/auth';
import { getGuestbookEntries } from 'app/db/queries';
import { SignIn, SignOut } from './buttons';
import { Suspense } from 'react';
import Form from './form';
import { TriangleAlert } from 'lucide-react';

const DISABLE_ADD_GUESTBOOOK_FORM = true

export const metadata = {
  title: 'Guestbook',
  description: 'Sign my guestbook and leave your mark.',
};

export default function GuestbookPage() {
  return (
    <section className={'animate-fadeIn'}>
      <h1 className="font-medium text-2xl mb-8 tracking-tighter">
        leave your feedback, thoughts, or just say hi!
      </h1>
      <Suspense>
        <div className='space-y-10'>
          <GuestbookForm />
          <GuestbookEntries />
        </div>
      </Suspense>
    </section>
  );
}

async function GuestbookForm() {
  let session = await auth();

  return session?.user ? (
    <>
      {DISABLE_ADD_GUESTBOOOK_FORM && <div className='rounded-md bg-tertiary p-2 flex justify-center items-center'><span>Guestbook Temporarily Disabled</span></div>}
      {!DISABLE_ADD_GUESTBOOOK_FORM && <Form />}
      {!DISABLE_ADD_GUESTBOOOK_FORM && <SignOut />}
    </>
  ) : (
    <>
      {DISABLE_ADD_GUESTBOOOK_FORM && <div className='rounded-md bg-tertiary p-2 flex justify-center items-center space-x-2'><TriangleAlert /><span className='text-white'>Guestbook Temporarily Disabled</span></div>}
      {!DISABLE_ADD_GUESTBOOOK_FORM && <SignIn />}
    </>
  );
}

async function GuestbookEntries() {
  let entries = await getGuestbookEntries();

  if (entries.length === 0) {
    return null;
  }

  return entries.map((entry) => (
    <div key={entry.id} className="flex flex-col space-y-1 mb-4">
      <div className="w-full text-sm break-words">
        <span className="mr-1">
          {entry.created_by}:
        </span>
        {entry.body}
      </div>
    </div>
  ));
}
