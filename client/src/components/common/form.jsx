import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";

function CommonForm({
  formControls,
  formData,
  setFormData,
  onSubmit,
  buttonText = "Submit",
  isBtnDisabled = false,
}) {
  const handleChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const renderField = (control) => {
    const value = formData[control.name] || "";

    switch (control.componentType) {
      case "input":
        return (
          <Input
            id={control.name}
            name={control.name}
            type={control.type}
            placeholder={control.placeholder}
            value={value}
            onChange={(e) => handleChange(control.name, e.target.value)}
          />
        );

      case "textarea":
        return (
          <Textarea
            id={control.name}
            name={control.name}
            placeholder={control.placeholder}
            value={value}
            onChange={(e) => handleChange(control.name, e.target.value)}
          />
        );

      case "select":
        return (
          <Select
            value={value}
            onValueChange={(val) => handleChange(control.name, val)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={control.label} />
            </SelectTrigger>
            <SelectContent>
              {control.options?.map((option) => (
                <SelectItem key={option.id} value={option.id}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      default:
        return (
          <Input
            id={control.name}
            name={control.name}
            type="text"
            placeholder={control.placeholder}
            value={value}
            onChange={(e) => handleChange(control.name, e.target.value)}
          />
        );
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {formControls.map((control) => (
        <div key={control.name} className="space-y-2">
          <Label htmlFor={control.name}>{control.label}</Label>
          {renderField(control)}
        </div>
      ))}
      <Button
        type="submit"
        disabled={isBtnDisabled}
        className="w-full mt-4"
      >
        {buttonText}
      </Button>
    </form>
  );
}

export default CommonForm;
