import React, { useState } from "react";
import emailjs from "emailjs-com";

const EmailForm = () => {
  const [formData, setFormData] = useState({
    userEmail: "",
    message: "",
  });

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const sendEmail = (e: any) => {
    e.preventDefault();

    // Zmienne dla konfiguracji EmailJS
    const serviceId = "YOUR_SERVICE_ID"; // Twój Service ID
    const templateId = "template_wekvtml"; // Twój Template ID
    const publicKey = "S7Xpo6k0DUoNNlf7P"; // Twój Public Key

    // Zmienne dla danych szablonu
    const emailParams = {
      user_email: formData.userEmail,
      message: formData.message,
    };

    emailjs.send(serviceId, templateId, emailParams, publicKey).then(
      (response) => {
        console.log("SUCCESS!", response.status, response.text);
        alert("Wiadomość została wysłana!");
      },
      (error) => {
        console.error("FAILED...", error);
        alert("Wystąpił błąd podczas wysyłania wiadomości.");
      }
    );
  };

  return (
    <form onSubmit={sendEmail}>
      <div>
        <label>
          Twój e-mail:
          <input
            type="email"
            name="userEmail"
            value={formData.userEmail}
            onChange={handleChange}
            required
          />
        </label>
      </div>
      <div>
        <label>
          Wiadomość:
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
          />
        </label>
      </div>
      <button type="submit">Wyślij wiadomość</button>
    </form>
  );
};

export default EmailForm;
