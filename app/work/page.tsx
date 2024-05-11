import Projects from "../components/Projects";
import Skills from "../components/Skills";

export default function Page() {
  return (
      <section>
          <h1 className="font-medium text-2xl mb-8 tracking-tighter">my work</h1>
          <section>
              <Projects/>
          </section>
      </section>
  );
}
