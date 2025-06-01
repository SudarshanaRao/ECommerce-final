import * as React from "react"
import * as AvatarPrimitive from "@radix-ui/react-avatar"

import { cn } from "@/lib/utils"

const Avatar = React.forwardRef(({ className, ...props }, ref) => (
  <AvatarPrimitive.Root
    ref={ref}
    className={cn(
      "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full shadow-md ring-2 ring-indigo-500 transition-transform hover:scale-105 hover:ring-pink-500",
      className
    )}
    {...props}
  />
))
Avatar.displayName = AvatarPrimitive.Root.displayName

const AvatarImage = React.forwardRef(({ className, src, ...props }, ref) => {
  // Generate a new random avatar for each component mount
  const generateAvatar = Math.floor(Math.random() * 70) + 1
  const [randomImage] = React.useState(() => `https://i.pravatar.cc/150?img=${generateAvatar}`)
  console.log("Image = ",randomImage);
  

  return (
    <AvatarPrimitive.Image
      ref={ref}
      className={cn("aspect-square h-full w-full object-cover", className)}
      src={randomImage || src}
      {...props}
    />
  )
})
AvatarImage.displayName = AvatarPrimitive.Image.displayName

const AvatarFallback = React.forwardRef(({ className, children, ...props }, ref) => (
  <AvatarPrimitive.Fallback
    ref={ref}
    className={cn(
      "flex h-full w-full items-center justify-center rounded-full bg-gradient-to-br from-purple-400 to-indigo-500 text-white font-semibold text-sm shadow-inner",
      className
    )}
    {...props}
  >
    {children || "👤"}
  </AvatarPrimitive.Fallback>
))
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName

export { Avatar, AvatarImage, AvatarFallback }
