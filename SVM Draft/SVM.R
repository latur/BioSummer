trainer<- function(filename, number){
  entries <- read.csv(filename)
  library(kernlab)
  result <- c();
  for(i in 1:number){
    x <- entries[, 3:ncol(entries)-1]
    y <- entries[, ncol(entries)]
    n <- nrow(entries)
    ntrain <- round(n*0.85)
    tindex <- sample(n,ntrain)
    xtrain <- x[tindex,]
    xtest <- x[-tindex,]
    ytrain <- y[tindex]
    ytest <- y[-tindex]
    rownames(xtrain)<-NULL;
    rownames(xtest)<-NULL;
    istrain=rep(0,n)
    istrain[tindex]=1
  #print(length(xtrain))
   # print(length(ytrain))
    svp <- ksvm(as.matrix(xtrain), ytrain, type="C-bsvc", kernel='rbfdot', C = 10, prob.model=TRUE)
    ypred = predict(svp,xtest)
    table(ytest,ypred)  
    result<-c(result, sum(ypred != ytest))
  }
  result
}
