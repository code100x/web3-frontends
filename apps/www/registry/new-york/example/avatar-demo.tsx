import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/registry/new-york/ui/avatar"

export default function AvatarDemo() {
  return (
    <Avatar>
      <AvatarImage src="https://github.com/code100x.png" alt="@code100x" />
      <AvatarFallback>CN</AvatarFallback>
    </Avatar>
  )
}
