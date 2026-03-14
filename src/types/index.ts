/* ------------------------------------------------------------------ */
/*  Tests                                                              */
/* ------------------------------------------------------------------ */

export interface Test {
  id: number;
  title: string;
  description: string;
  question_count: number;
}

export interface QuestionOption {
  A: string;
  B: string;
  C: string;
  D: string;
}

export interface Question {
  question_id: number;
  question_text: string;
  options: QuestionOption;
}

export type OptionLabel = "A" | "B" | "C" | "D";

export interface AnswerItem {
  question_id: number;
  selected_option: OptionLabel;
}

export interface SubmitPayload {
  test_id: number;
  first_name: string;
  last_name: string;
  middle_name?: string;
  answers: AnswerItem[];
}

export interface SubmitResponse {
  total_questions: number;
  correct_answers: number;
  wrong_answers: number;
  score: number;
  is_passed: boolean;
  certificate_id?: string;
}

export interface CertificateVerifyResponse {
  valid: boolean;
  full_name: string;
  test_title: string;
  score: number;
  submitted_at: string;
  certificate_id: string;
}

/* ------------------------------------------------------------------ */
/*  API Error                                                          */
/* ------------------------------------------------------------------ */

export interface ApiError {
  error: boolean;
  message: string;
  details?: Record<string, string[]>;
}
