import { wait } from "@/utils";

export default async function Page() {
    await wait(3000);
    return <div>Page 2</div>;
}
