package com.fiona.flashmind;

public class Flashcard {
    private  Long id;
    private String question ;
    private String answer;
    private  String category;

    //constructor
    public Flashcard(Long id, String question, String answer, String category) {
        this.id = id;
        this.question = question;
        this.answer = answer;
        this.category = category;
    }

    //Getters and setters
    public Long getId() {return id;}
    public void setId(Long id) {this.id = id;}

    public String getQuestion() {return question;}
    public void setQuestion(String question) {this.question = question;}

    public String getAnswer() {return answer;}
    public void setAnswer(String answer) {this.answer = answer;}

    public String getCategory() {return category;}
    public void setCategory(String category) {this.category = category;}
}
