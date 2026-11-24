# Branching Strategy

Make sure to use the branching strategy correctly as stated here (@adirnberger-htl):  

## Git-Flow Workflow Diagram
Look at [5.1.2. Branching-Strategies](https://2526-3bhif-syp.github.io/2526-3bhif-syp-lecture-notes/#:~:text=5%2E1%2E2%2E%20Branching%2DStrategies) for reference  

(Note that in the following image the Review branch is called Release. We'll label it as "Release" for clarity purposes.)

![alt text](https://2526-3bhif-syp.github.io/2526-3bhif-syp-lecture-notes/images/gitflow_diagram_gfg.png)

## Explanation  

The Dev branch will be the branch we'll be working on primarily.  

Whenever we begin with a new feature, we create a new branch and work on the branch until it is done.  
We'll use the naming-convention "feat/***issueNumber***-***shortDescription/featureName***"  (example: "feat/15-mediapipe-tracking)  
Once it is done, we merge the feature branch and **delete** it.  

As soon as all the features that were agreed on to be finished until the next spring are finished, we create a ***Review branch*** and present the review branch.  
We'll use the naming-convention "Review/***number***"  (example: "Review/2.0)  
If everything is in order, we merge the branch with main and have a new release.  

In case we have any major bugs in the release branch (unlikely but still possible) we create a ***Hotfix branch*** from main and merge that with main and dev as soon as the bug is fixed.  
We'll use the naming-convention "Hotfix/***mainVersionNumber***"  (example: "Hotfix/2.0) 

Make sure **not to delete** any branches unless needed.
