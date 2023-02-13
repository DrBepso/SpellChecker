package com.example.springboot.model;

import java.util.List;

public class Match {
    private String surface;
    private int beginOffset;
    private int endOffset;
    private List<String> replacement;

    public Match(){}
    public Match(String surface, int beginOffset, int endOffset, List<String> list) {
        this.surface = surface;
        this.beginOffset = beginOffset;
        this.endOffset = endOffset;
        this.replacement = list;
    }
    public String getSurface() {
        return surface;
    }
    public void setSurface(String surface) {
        this.surface = surface;
    }
    public int getBeginOffset() {
        return beginOffset;
    }
    public void setBeginOffset(int beginOffset) {
        this.beginOffset = beginOffset;
    }
    public int getEndOffset() {
        return endOffset;
    }
    public void setEndOffset(int endOffset) {
        this.endOffset = endOffset;
    }
    public List<String> getReplacement() {
        return replacement;
    }
    public void setReplacement(List<String> replacement) {
        this.replacement = replacement;
    }

    
}
