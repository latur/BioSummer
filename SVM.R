entries <- read.csv("data.csv")
x <- entries[, 2:92]
y <- entries[, 93]
n <- 170
ntrain <- round(n*0.8)
tindex <- sample(n,ntrain)
xtrain <- x[tindex,]
xtest <- x[-tindex,]
ytrain <- y[tindex]
ytest <- y[-tindex]
istrain=rep(0,n)
istrain[tindex]=1
library(kernlab)

svp <- ksvm(as.matrix(xtrain), ytrain, type="C-bsvc", kernel='rbf', C = 10, prob.model=TRUE)
ypred = predict(svp,xtest)
table(ytest,ypred)