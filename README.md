Hi!
This is my apartment scraper

Prerequisites:

- A docker container created from the ollama image, named 'ollama' with llama3.1 installed.
  NOTE: it must map its 11343 port to your own.

## OLTP DB

```mermaid
erDiagram
    POSTS {
        int id PK
        string posterName
        string postContent
        string[] imageUrls
    }

    ITEMS {
           note for items
      An item has exactly one subtype record
      stored in one of the subtype tables
    end noteint id PK
        int post_id FK
        string item_type
        int specific_item_id FK
    }

    ITEMS_APARTMENTS {
        int id PK
        string location
        int rooms
        float size
        float price
    }

    ITEMS_UNSPECIFIED {
        int id PK
        string title
        string description
        float price
    }

    ITEMS_MUSICAL_INSTRUMENTS {
        int id PK
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
