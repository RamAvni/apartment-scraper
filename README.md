## OLTP DB
```mermaid
erDiagram
    POSTS {
        int id PK "NOT_NULL"
        string posterName "NOT_NULL"
        string postContent "NOT_NULL"
        string[] imageUrls
    }

    ITEMS {
        int id PK "NOT_NULL"
        int post_id FK "NOT_NULL"
        string item_type
        int specific_item_id FK "NOT_NULL"
    }

    ITEMS_APARTMENTS {
        int id PK "NOT_NULL"
        string rent_type "ENUM('long-term', 'short-term', 'sublet')"
        boolean is_shared
        string city
        string neighborhood
        string street
        number rent_price
        number num_rooms
        number floor_num
        float size_sqm
        string entry_date
        string leave_date
        string contact_phone
        string[] amenities
        string[] notes
    }

    ITEMS_UNSPECIFIED {
        int id PK "NOT_NULL"
        string title
        string description
        float price
    }

    ITEMS_MUSICAL_INSTRUMENTS {
        int id PK "NOT_NULL"
        string category
        string condition
        float price
    }

    POSTS ||--o{ ITEMS : "has many"
    ITEMS ||--|| ITEMS_APARTMENTS : "specific item (if type=apartment)"
    ITEMS ||--|| ITEMS_UNSPECIFIED : "specific item (if type=unspecified)"
    ITEMS ||--|| ITEMS_MUSICAL_INSTRUMENTS : "specific item (if type=musical_instrument)"
```

> [!NOTE]
> In the items table, an item has exactly one subtype record stored in one of the subtype tables (e.g. A `Post` about an `Item` which is an `Apartment`)
> So, while this is the diagram, it may not accurately represent the actual state of the DB.
