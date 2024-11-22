import React, { useState, useEffect } from "react";
import "./Build.css";

const prices = {
  desoldering: {
    "Less than 60 %": 150000,
    "60 - 65%": 200000,
    "75% - TKL": 250000,
    "TKL +": 300000,
    None: 0,
  },
  assembly: {
    "Less than 60 %": 350000,
    "60 - 65%": 400000,
    "75% - TKL": 500000,
    "TKL +": 600000,
    "Hotswap all size": 250000,
  },
};

const Build: React.FC = () => {
  const [formData, setFormData] = useState<{
    keyboardKitName: string;
    switchesName: string;
    layout: string;
    withSwitches: string;
    switchQuantity: string;
    stabilizerName: string;
    plateChoice: string;
    providingKeycap: string;
    desoldering: string;
    assembly: string;
    additionalNotes: string;
    termsAccepted: boolean;
  }>({
    keyboardKitName: "",
    switchesName: "",
    layout: "",
    withSwitches: "",
    switchQuantity: "",
    stabilizerName: "",
    plateChoice: "",
    providingKeycap: "",
    desoldering: "",
    assembly: "",
    additionalNotes: "",
    termsAccepted: false,
  });

  const [total, setTotal] = useState(0);

  // Calculate total cost
  useEffect(() => {
    const desolderingCost =
      prices.desoldering[
        formData.desoldering as keyof typeof prices.desoldering
      ] || 0;
    const assemblyCost =
      prices.assembly[formData.assembly as keyof typeof prices.assembly] || 0;

    setTotal(desolderingCost + assemblyCost);
  }, [formData]);

  // Handle input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;

    if (type === "radio") {
      setFormData((prev) => ({
        ...prev,
        [name as keyof typeof formData]:
          prev[name as keyof typeof formData] === value ? "" : value, // Toggle selection on double-click
      }));
    } else if (type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        [name]: checked,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // Submit handler with validation
  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate required fields
    const requiredFields = [
      "keyboardKitName",
      "switchesName",
      "layout",
      "withSwitches",
      "switchQuantity",
      "stabilizerName",
      "plateChoice",
      "desoldering",
      "assembly",
    ];
    const missingFields = requiredFields.filter(
      (field) => !formData[field as keyof typeof formData]
    );

    if (missingFields.length > 0) {
      alert("Please fill all required fields.");
      return;
    }

    if (!formData.termsAccepted) {
      alert("You must agree to the terms before submitting.");
      return;
    }

    alert("Form submitted successfully!");
    console.log("Form Data:", formData);
  };

  return (
    <div className="build-container">
      <h1>Keyboard Build Service</h1>
      <form className="build-form" onSubmit={handleFormSubmit}>
        <div className="form-group">
          <label>Keyboard Kit Name (Required)</label>
          <input
            type="text"
            name="keyboardKitName"
            value={formData.keyboardKitName}
            placeholder="Provide the name of the keyboard kit"
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Switches (Required)</label>
          <input
            type="text"
            name="switchesName"
            placeholder="Provide the name of the switches"
            value={formData.switchesName}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Layout (Required)</label>
          <div className="radio-group">
            {[
              "Equal or less than 40%",
              "60 - 65%",
              "70 - 75%",
              "TKL",
              "98 - 100% ~ 1800",
              "Others",
            ].map((option) => (
              <label key={option}>
                <input
                  type="radio"
                  name="layout"
                  value={option}
                  checked={formData.layout === option}
                  onChange={handleInputChange}
                  required
                />
                {option}
              </label>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label>With Switches (Required)</label>
          <div className="radio-group">
            {["Yes, I have a Switch Mod order", "No, I will include mine"].map(
              (option) => (
                <label key={option}>
                  <input
                    type="radio"
                    name="withSwitches"
                    value={option}
                    checked={formData.withSwitches === option}
                    onChange={handleInputChange}
                    required
                  />
                  {option}
                </label>
              )
            )}
          </div>
        </div>

        <div className="form-group">
          <label>Stabilizer Name (Required)</label>
          <input
            type="text"
            name="stabilizerName"
            placeholder="All build are required to provide stabs"
            value={formData.stabilizerName}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Switch Quantity (Required)</label>
          <input
            type="number"
            name="switchQuantity"
            placeholder="Recommended +5 more than the build need for backup"
            value={formData.switchQuantity}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Plate Choice (Required)</label>
          <input
            type="text"
            name="plateChoice"
            placeholder="Materials like Aluminum / FR4 / PP / etc for the build"
            value={formData.plateChoice}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Desoldering (Required)</label>
          <div className="radio-group">
            {Object.entries(prices.desoldering).map(([key, value]) => (
              <label key={key}>
                <input
                  type="radio"
                  name="desoldering"
                  value={key}
                  checked={formData.desoldering === key}
                  onChange={handleInputChange}
                  required
                />
                {key} ({value.toLocaleString()} VND)
              </label>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label>Are You Providing Keycap</label>
          <input
            type="text"
            name="providingKeycap"
            placeholder="[Keycap Model] - Optional, but final stab tuning will not be guarantee"
            value={formData.providingKeycap}
            onChange={handleInputChange}
          />
        </div>

        <div className="form-group">
          <label>Assembly (Required)</label>
          <div className="radio-group">
            {Object.entries(prices.assembly).map(([key, value]) => (
              <label key={key}>
                <input
                  type="radio"
                  name="assembly"
                  value={key}
                  checked={formData.assembly === key}
                  onChange={handleInputChange}
                  required
                />
                {key} ({value.toLocaleString()} VND)
              </label>
            ))}
          </div>
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
          <p>{total.toLocaleString()} VND</p>
        </div>

        <button type="submit" className="submit-btn">
          Submit
        </button>
      </form>
    </div>
  );
};

export default Build;
