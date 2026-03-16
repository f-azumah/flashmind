package com.fiona.flashmind;

import org.springframework.web.bind.annotation.*;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/cards")
@CrossOrigin(origins = "http://localhost:3000")
public class FlashcardController {

    private List<Flashcard> cards = new ArrayList<>();
    private CardStack cardStack = new CardStack();
    private Long nextId = 1L;

    // get all cards
    @GetMapping
    public List<Flashcard> getAllCards() {
        return cards;
    }

    // post - add a new card
    @PostMapping
    public Flashcard addCard(@RequestBody Flashcard card) {
        card.setId(nextId++);
        cards.add(card);
        cardStack.push(card);
        return card;
    }

    // delete a card by id
    @DeleteMapping("/{id}")
    public String deleteCard(@PathVariable Long id) {
        cards.removeIf(card -> card.getId().equals(id));
        return "Card deleted successfully";
    }

    // get next card from stack (for quiz mode)
    @GetMapping("/next")
    public Flashcard getNextCard() {
        if (cardStack.isEmpty()) {
            cardStack.shuffle(cards);
        }
        return cardStack.pop();
    }

    // get remaining cards in stack
    @GetMapping("/remaining")
    public int getRemainingCards() {
        return cardStack.size();
    }
}
