/* ------------------------------------------------------------------ */
/*  Auth                                                               */
/* ------------------------------------------------------------------ */

export interface RegisterPayload {
  first_name: string;
  last_name: string;
  middle_name: string;
  passport_series_number: string;
  workplace: string;
  position: string;
  password: string;
  password_confirm: string;
}

export interface LoginPayload {
  passport_series_number: string;
  password: string;
}

export interface AuthTokens {
  access: string;
  refresh: string;
}

export interface UserProfile {
  id: number;
  first_name: string;
  last_name: string;
  middle_name: string;
  passport_series_number: string;
  workplace: string;
  position: string;
  full_name: string;
  date_joined: string;
}

export interface RegisterResponse {
  user: Omit<UserProfile, "full_name" | "date_joined">;
  tokens: AuthTokens;
}

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
  answers: AnswerItem[];
}

export interface TestResult {
  id: number;
  test: number;
  test_title: string;
  total_questions: number;
  correct_answers: number;
  wrong_answers: number;
  score: number;
  submitted_at: string;
}

export interface SubmitResponse {
  total_questions: number;
  correct_answers: number;
  wrong_answers: number;
  score: number;
}

/* ------------------------------------------------------------------ */
/*  API Error                                                          */
/* ------------------------------------------------------------------ */

export interface ApiError {
  error: boolean;
  message: string;
  details?: Record<string, string[]>;
}