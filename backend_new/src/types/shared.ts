// export enum Dept {
//     EC = 'EC',
//     RR = 'RR',
//     HSN = 'HSN',
// }

// export enum Campus {
//     EC = 'EC',
//     RR = 'RR',
//     HSN = 'HSN',
// }

export const CAMPUS = ['EC', 'RR', 'HN'] as const;
export type Campus = (typeof CAMPUS)[number];

export const DEPARTMENTS = [
    'ECE',
    'CSE',
    'Science & Humanities',
    'Commerce & Management',
    'Pharmaceutical Sciences',
] as const;
export type Department = (typeof DEPARTMENTS)[number];
