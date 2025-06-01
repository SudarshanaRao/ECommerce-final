import { Button } from "../ui/button";
import { Card, CardContent, CardFooter } from "../ui/card";
import { Label } from "../ui/label";

function AddressCard({
  addressInfo,
  handleDeleteAddress,
  handleEditAddress,
  setCurrentSelectedAddress,
  selectedId,
}) {
  const isSelected = selectedId?._id === addressInfo?._id;

  return (
    <Card
      onClick={
        setCurrentSelectedAddress
          ? () => setCurrentSelectedAddress(addressInfo)
          : null
      }
      className={`
        cursor-pointer
        border-2
        rounded-lg
        shadow-md
        transition
        duration-300
        ease-in-out
        ${
          isSelected
            ? "border-primary-600 shadow-lg bg-primary-50 scale-105"
            : "border-muted hover:shadow-lg hover:scale-[1.03] hover:border-primary-400"
        }
        relative
      `}
    >
      {isSelected && (
        <span className="absolute top-2 right-2 bg-primary-600 text-white px-2 py-1 rounded-full text-xs font-bold select-none animate-pulse shadow-lg">
          ✅ Selected
        </span>
      )}

      <CardContent className="grid p-6 gap-3">
        <Label className="text-lg font-semibold text-primary-700 flex items-center gap-2">
          📍 Address: <span className="font-normal text-foreground">{addressInfo?.address}</span>
        </Label>
        <Label className="flex items-center gap-2 text-primary-600">
          🏙 City: <span className="font-normal text-foreground">{addressInfo?.city}</span>
        </Label>
        <Label className="flex items-center gap-2 text-primary-600">
          📮 Pincode: <span className="font-normal text-foreground">{addressInfo?.pincode}</span>
        </Label>
        <Label className="flex items-center gap-2 text-primary-600">
          📞 Phone: <span className="font-normal text-foreground">{addressInfo?.phone}</span>
        </Label>
        <Label className="flex items-center gap-2 text-primary-600">
          📝 Notes: <span className="font-normal text-foreground">{addressInfo?.notes || "—"}</span>
        </Label>
      </CardContent>

      <CardFooter className="p-4 flex justify-between gap-4">
        <Button
          onClick={() => handleEditAddress(addressInfo)}
          className="bg-primary hover:bg-primary-dark transition-transform hover:scale-105 text-white"
          aria-label="Edit address"
        >
          ✏️ Edit
        </Button>
        <Button
          onClick={() => handleDeleteAddress(addressInfo)}
          className="bg-destructive hover:bg-destructive-dark transition-transform hover:scale-105 text-white"
          aria-label="Delete address"
        >
          🗑️ Delete
        </Button>
      </CardFooter>
    </Card>
  );
}

export default AddressCard;
