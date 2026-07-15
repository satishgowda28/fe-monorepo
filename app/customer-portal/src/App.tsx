import { Button } from "@repo/ui";
import { formatCurrency } from "@repo/utils";
import "./App.css";

function App() {
  return (
    <>
      <section id="center">
        <div>
          <h1>Get started</h1>
          <Button
            onClick={() => {
              alert(formatCurrency(123456));
            }}
          ></Button>
          <p>
            Edit <code>src/App.tsx</code> and save to test <code>HMR</code>
          </p>
          <p>Hello World</p>
        </div>
      </section>

      <div className="ticks"></div>
      <section id="spacer"></section>
    </>
  );
}

export default App;
