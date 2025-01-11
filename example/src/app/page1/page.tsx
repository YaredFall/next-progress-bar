import { wait } from "@/utils";

export default async function Page() {
    await wait(1000);
    return <div>Page 1</div>;
}
