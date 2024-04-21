import About from "./components/About";

export default function Page() {
  return (
    <section>
      <h1 className="font-medium text-2xl mb-8 tracking-tighter">my portfolio</h1>
      <p className="prose prose-neutral dark:prose-invert">
           Hey there, I'm DKS - Computer Scientist & Engineer. <br/> Feel free to take a look around and see what I've been getting up to ;)
      </p>
      <About/>
    </section>
  );
}
