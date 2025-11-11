import { SectionType } from "../enums/section-type";

export interface LegalLinks {
    sectionId: string,
    title: string,
    section: SectionType,
    active: boolean
}