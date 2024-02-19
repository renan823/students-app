import { sendEvent } from "../../../../utils/api";

export async function searchLectures (searchParam: string) {
    try {
        const data: any = await sendEvent("find-lectures-by-student-name", searchParam);
        console.log(data)
        return data;
    } catch (error) {
        throw error;
    }
}