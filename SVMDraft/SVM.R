entries <- read.csv("/Users/latur/Documents/Bio/BioSummer/Boost/net/_net4k.ON.csv")
m <- dim(entries)[2]
n <- dim(entries)[1]
x <- entries[, 2:(m-1)]
y <- entries[, m]

library(kernlab)

  for (i in 1:2) {
    ntrain <- round(n*0.8)
    tindex <- sample(n,ntrain)
    xtrain <- x[tindex,]
    xtest <- x[-tindex,]
    ytrain <- y[tindex]
    ytest <- y[-tindex]
    istrain=rep(0,n)
    istrain[tindex]=1
    svp <- ksvm(as.matrix(xtrain), ytrain, type="C-bsvc", kernel='rbf', C = 10, prob.model=TRUE)
    ypred = predict(svp,xtest)
    falses <- sum(ytest != ypred)
    total <- sum(ytest != ypred) + sum(ytest == ypred)
    ok <- 1-falses/total
    ok
  }

