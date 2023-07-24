import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function ContentWarningOverlay() {
  const navigate = useNavigate();
  const [is18Plus, setIs18Plus] = useState(
    Boolean(window.localStorage.getItem("accepted-content-warning"))
  );
  if (is18Plus) return null;

  function grownUp() {
    window.localStorage.setItem("accepted-content-warning", "true");
    setIs18Plus(true);
  }

  return (
    <div className="fullscreen-exclusive age-check">
      <h1>Sexually explicit material ahead!</h1>
      <h2>Confirm your age</h2>
      <div className="flex g24">
        <button className="btn btn-warning" onClick={grownUp}>
          Yes, I am over 18
        </button>
        <button className="btn" onClick={() => navigate("/")}>
          No, I am under 18
        </button>
      </div>
    </div>
  );
}
