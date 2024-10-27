interface TelegramWebApp {
    initData: string;
    initDataUnsafe: {
      query_id: string;
      user?: {
        id: number;
        first_name: string;
        last_name?: string;
        username?: string;
        language_code?: string;
      };
      auth_date: number;
      hash: string;
    };
    colorScheme: 'light' | 'dark';
    showPopup: (params: { 
      title?: string;
      message: string;
      buttons?: Array<{
        text: string;
        type?: 'default' | 'ok' | 'close' | 'cancel';
      }>;
    }) => void;
    close: () => void;
    ready: () => void;
    expand: () => void;
  }
  
  declare global {
    interface Window {
      Telegram?: {
        WebApp: TelegramWebApp;
      };
    }
  }
  
  export {};