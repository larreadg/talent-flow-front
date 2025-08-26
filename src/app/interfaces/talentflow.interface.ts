export interface TalentFlowResponse {
    status: 'success' | 'error';
    code: number;
    data: unknown;
    message: string;
}
