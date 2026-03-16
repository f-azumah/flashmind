package com.fiona.flashmind;

import java.util.Stack;
import java.util.List;
import java.util.ArrayList;
import java.util.Collections;

public class CardStack {
    private Stack<Flashcard> stack;

    public CardStack(){
        this.stack = new Stack<>();
    }

    // add a card to the stack
    public void push(Flashcard card){
        stack.push(card);
    }

    // get the next card from the stack
    public Flashcard pop(){
        if (!stack.empty()){
            return stack.pop();
        }
        return null;
    }

    // peek at the top card without removing it
    public Flashcard peek(){
        if (!stack.isEmpty()) {
            return stack.peek();
        }
        return null;
    }

    // shuffle and reload the stack
    public void shuffle(List<Flashcard> cards){
        stack.clear();
        List<Flashcard> shuffled = new ArrayList<>(cards);
        Collections.shuffle(shuffled);
        for (Flashcard card : shuffled){
            stack.push(card);
        }
    }

    // check if stack is empty
    public boolean isEmpty(){
        return stack.isEmpty();
    }

    // get remaining card count
    public int size(){
        return stack.size();
    }
}
