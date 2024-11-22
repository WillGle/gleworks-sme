import React, { useState, useEffect } from "react";
import "./Switch.css";

type SpringPreference = "Payson" | "Geon" | "TX" | "Chewy" | "SPRiT" | "";

const prices = {
  lube: 5000,
  films: 3000,
  springs: 1000,
  clean: 4000,
  payson: 3000,
  geon: 2500,
  tx: 3000,
  chewy: 3000,
  sprit: 4000,
};

const Switch: React.FC = () => {
  const [formData, setFormData] = useState<{
    switchName: string;
    amount: string;
    moddingPreferences: {
      lube: boolean;
      films: boolean;
      springs: boolean;
      clean: boolean;
    };
    springPreference: SpringPreference;
    additionalNotes: string;
    termsAccepted: boolean;
  }>({
    switchName: "",
    amount: "",
    moddingPreferences: {
      lube: false,
      films: false,
      springs: false,
      clean: false,
    },
    springPreference: "",
    additionalNotes: "",
    termsAccepted: false,
  });

  const [total, setTotal] = useState(0);

  useEffect(() => {
    const amount = parseInt(formData.amount) || 0;

    const moddingTotal =
      (formData.moddingPreferences.lube ? prices.lube : 0) +
      (formData.moddingPreferences.films ? prices.films : 0) +
      (formData.moddingPreferences.springs ? prices.springs : 0) +
      (formData.moddingPreferences.clean ? prices.clean : 0);

    const springTotal =
      prices[formData.springPreference.toLowerCase() as keyof typeof prices] ||
      0;

    const calculatedTotal = amount * moddingTotal + amount * springTotal;
    setTotal(calculatedTotal);
  }, [formData]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;

    if (type === "checkbox") {
      if (name in formData.moddingPreferences) {
        setFormData((prev) => ({
          ...prev,
          moddingPreferences: {
            ...prev.moddingPreferences,
            [name]: checked,
          },
        }));
      } else {
        setFormData((prev) => ({
          ...prev,
          [name]: checked,
        }));
      }
    } else if (type === "radio") {
      setFormData((prev) => ({
        ...prev,
        springPreference:
          prev.springPreference === value ? "" : (value as SpringPreference), // Toggle selection
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const hasSelectedModdingPreference = Object.values(
      formData.moddingPreferences
    ).some((selected) => selected);

    if (
      !formData.switchName ||
      !formData.amount ||
      !hasSelectedModdingPreference ||
      !formData.termsAccepted
    ) {
      alert(
        "Please fill all required fields, select at least one modding preference, and agree to the terms."
      );
      return;
    }

    // Prepare data for submission
    const orderData = {
      switchName: formData.switchName,
      amount: parseInt(formData.amount),
      lube: formData.moddingPreferences.lube,
      films: formData.moddingPreferences.films,
      springs: formData.moddingPreferences.springs,
      clean: formData.moddingPreferences.clean,
      springPreference: formData.springPreference,
      additionalNotes: formData.additionalNotes,
      termsAccepted: formData.termsAccepted,
      total: total,
    };

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/services/switch-modding`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      if (response.ok) {
        const result = await response.json();
        alert("Order created successfully!");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("An error occurred while submitting the form.");
    }
  };

  return (
    <div className="switch-container">
      <h1 className="switch-title">Switch Modding Service</h1>
      <form className="switch-form" onSubmit={handleFormSubmit}>
        <div className="form-group">
          <label>Switch Name (Required)</label>
          <input
            type="text"
            name="switchName"
            value={formData.switchName}
            onChange={handleInputChange}
            className="input-field"
            placeholder="Provide the name of the switches"
            required
          />
        </div>

        <div className="form-group">
          <label>Amount (Required)</label>
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleInputChange}
            className="input-field"
            placeholder="Enter the amount"
            required
          />
        </div>

        <div className="form-group">
          <label>Switch Modding Preference (ea) (Required)</label>
          <div className="form-group-note">
            Can select more than one option. Unit: each
          </div>
          <div className="checkbox-group">
            <label>
              <input
                type="checkbox"
                name="lube"
                checked={formData.moddingPreferences.lube}
                onChange={handleInputChange}
              />
              Lube (5000 VND)
            </label>
            <label>
              <input
                type="checkbox"
                name="films"
                checked={formData.moddingPreferences.films}
                onChange={handleInputChange}
              />
              Films (3000 VND)
            </label>
            <label>
              <input
                type="checkbox"
                name="springs"
                checked={formData.moddingPreferences.springs}
                onChange={handleInputChange}
              />
              Springs Change (1000 VND)
            </label>
            <label>
              <input
                type="checkbox"
                name="clean"
                checked={formData.moddingPreferences.clean}
                onChange={handleInputChange}
              />
              Clean (4000 VND)
            </label>
          </div>
        </div>

        <div className="form-group">
          <label>My Spring Preference (ea) (if you use mine)</label>
          <div className="form-group-note">
            Can select only one option. Unit: each
          </div>
          <div className="radio-group">
            {["Payson", "Geon", "TX", "Chewy", "SPRiT"].map((option) => (
              <label key={option}>
                <input
                  type="radio"
                  name="springPreference"
                  value={option}
                  checked={formData.springPreference === option}
                  onChange={handleInputChange}
                  onDoubleClick={() =>
                    setFormData((prev) => ({ ...prev, springPreference: "" }))
                  }
                />
                {option} ({prices[option.toLowerCase() as keyof typeof prices]}{" "}
                VND)
              </label>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label>Additional Notes</label>
          <textarea
            name="additionalNotes"
            value={formData.additionalNotes}
            onChange={handleInputChange}
            className="input-field additional-notes"
          />
        </div>
        <div className="form-group terms-group">
          <label>
            <input
              type="checkbox"
              name="termsAccepted"
              checked={formData.termsAccepted}
              onChange={handleInputChange}
              required
            />
            I agree to the terms.
          </label>
        </div>
        <div className="total-section">
          <h2>Total</h2>
          <span>{total.toLocaleString()} VND</span>
        </div>
        <button type="submit" className="submit-btn">
          Submit
        </button>
      </form>
    </div>
  );
};

export default Switch;
