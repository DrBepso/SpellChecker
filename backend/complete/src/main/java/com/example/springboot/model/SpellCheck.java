package com.example.springboot.model;

import java.util.List;
import java.util.UUID;

public class SpellCheck {
    private String id;
    private Info info;
    private List<Issue> issues;

    public SpellCheck() {

    }
    public SpellCheck(Info info, List<Issue> issues) {
        this.id = UUID.randomUUID().toString();
        this.info = info;
        this.issues = issues;
    }

    public String getId() {
        return id;
    }

    public Info getInfo() {
        return info;
    }

    public void setInfo(Info info) {
        this.info = info;
    }

    public List<Issue> getIssues() {
        return issues;
    }

    public void setIssues(List<Issue> issues) {
        this.issues = issues;
    }

    
    
}

