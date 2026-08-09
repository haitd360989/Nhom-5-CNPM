erDiagram
    USERS ||--o{ DIAGNOSTIC_SESSIONS : "thực hiện"
    USERS ||--o{ ROADMAPS : "sở hữu"
    DIAGNOSTIC_SESSIONS ||--o{ SESSION_ANSWERS : "chứa chi tiết"
    QUESTIONS ||--o{ SESSION_ANSWERS : "được trả lời"
    ROADMAPS ||--o{ DAILY_TASKS : "chứa danh sách"

    USERS {
        bigint id PK
        string email UK
        string password_hash
        string full_name
        string role
        string status
        timestamp created_at
        timestamp updated_at
    }

    QUESTIONS {
        bigint id PK
        text content
        json options
        string correct_option
        string subject
        string topic
        string difficulty
        text explanation
        timestamp created_at
    }

    DIAGNOSTIC_SESSIONS {
        bigint id PK
        bigint user_id FK
        numeric score
        string status
        timestamp started_at
        timestamp completed_at
    }

    SESSION_ANSWERS {
        bigint id PK
        bigint session_id FK
        bigint question_id FK
        string selected_option
        boolean is_correct
        timestamp answered_at
    }

    ROADMAPS {
        bigint id PK
        bigint user_id FK
        string title
        numeric target_score
        integer total_days
        integer current_day
        string status
        timestamp created_at
        timestamp updated_at
    }

    DAILY_TASKS {
        bigint id PK
        bigint roadmap_id FK
        integer day_number
        string task_name
        string task_type
        bigint target_id
        string status
        timestamp created_at
    }