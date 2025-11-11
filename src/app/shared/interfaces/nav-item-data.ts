import { SectionType } from "../enums/section-type";

export interface NavItemData {
    sectionId: string,
    title: string,
    imagePath: string,
    section: SectionType,
    active: boolean
}