interface Window {
  gtag: (
    command: 'event',
    action: string,
    params: {
      event_category?: string;
      event_label?: string;
      value?: number;
      max_allowed?: number;
    }
  ) => void;
} 