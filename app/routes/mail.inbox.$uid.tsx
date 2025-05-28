import { Button } from "~/components/ui/button";
import { ArrowLeft, Forward, Reply, Star, Trash } from "lucide-react";
import { Separator } from "~/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Link } from "@remix-run/react";

export default function Page() {
  return (
    <div className="col-span-5 flex flex-col pl-4">
      <div className="flex gap-1 items-center">
        <Link to="/mail/inbox">
          <Button size="sm" variant="ghost">
            <ArrowLeft /> Back
          </Button>
        </Link>
        <Button size="sm" variant="ghost">
          <Reply /> Reply
        </Button>
        <Button size="sm" variant="ghost">
          <Forward /> Forward
        </Button>
        <Button size="sm" variant="ghost">
          <Star /> Favorite
        </Button>
        <Button size="sm" variant="ghost">
          <Trash /> Delete
        </Button>
      </div>
      <Separator className="my-2" />
      <div className="flex flex-col gap-2">
        <p className="font-medium line-clamp-1">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Rem, dicta!
        </p>
        <div className="flex gap-4">
          <Avatar className="size-10">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div className="flex flex-col gap-1">
            <p className="font-medium line-clamp-1">
              Name - <span className="text-xs text-muted-foreground">time</span>
            </p>
            <p className="text-xs text-muted-foreground">
              from: name@gmail.com
            </p>
            <div className="flex gap-4">
              <p className="text-xs text-muted-foreground">
                to: name@gmail.com
              </p>
              <p className="text-xs text-muted-foreground">
                cc: name@gmail.com
              </p>
            </div>
          </div>
        </div>
        <Separator />
        <p className="text-sm">
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Vel autem
          impedit itaque. Soluta repellendus eos, harum laudantium quod
          laboriosam at tenetur inventore non sint nobis ex excepturi molestias
          ad praesentium similique aspernatur ipsam distinctio, quia odit! Saepe
          voluptates quibusdam at.
        </p>
      </div>
    </div>
  );
}
