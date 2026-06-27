export interface SpinResult {
  prize_name: string;
  emoji: string;
  color: string;
  is_winner: boolean;
  description: string;
  target_segment: number;
}

export interface StatsResult {
  spins_today: number;
  winners_today: number;
}

export interface WinnerFeedItem {
  id: string;
  display_name: string;
  prize_name: string;
  created_at: string;
}

export interface WheelSegment {
  name: string;
  emoji: string;
  color: string;
  index: number;
}
