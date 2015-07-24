trainer <- function(filename, number){
#"_net4k.ON.csv"
entries <- read.csv(filename)
m <- dim(entries)[2]
n <- dim(entries)[1]
x <- entries[, 2:(m-1)]
y <- entries[, m]
result <- c();
library(kernlab)
  for (i in 1:number) {
    print(i);
    ntrain <- round(n*0.8)
    tindex <- sample(n,ntrain)
    xtrain <- x[tindex, 1:640]
    xtest <- x[-tindex, 1:640]
    ytrain <- y[tindex]
    ytest <- y[-tindex]
    istrain=rep(0,n)
    rownames(xtrain)<-NULL;
    rownames(xtest)<-NULL;
    istrain[tindex]=1
    svp <- ksvm(as.matrix(xtrain), ytrain, type="C-bsvc", kernel='rbf', C = 10, prob.model=TRUE, scale = FALSE)
    ypred = predict(svp,as.matrix(xtest))
    falses <- sum(ytest != ypred)
    total <- sum(ytest != ypred) + sum(ytest == ypred)
    ok <- 1-falses/total
    result<-c(result, ok)
  }
  result
}
