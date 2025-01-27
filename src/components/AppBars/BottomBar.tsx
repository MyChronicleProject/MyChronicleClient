import { Button } from "semantic-ui-react";
import "../../Styles/appBarStyle.css";

export default function BottomBar() {
  return (
    <div className="appBarBottom">
      <p className="contact-text">Skontaktuj się z nami! </p>
      <Button className="username-button">
        <a href="mailto:mychronicleofficial@gmail.com">Contact Email</a>
      </Button>|
    </div>
  );
}
