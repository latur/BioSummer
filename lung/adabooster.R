library("adabag")
adabooster<-function(filename){
  data <- read.csv(filename)
  size <- length(data[[1]])
  data <- data[,2:ncol(data)]
  rrOnAdaResult<-boosting(type~., data=data, boos=TRUE, mfinal=10)
  bestfautures<-rrOnAdaResult$importance[rrOnAdaResult$importance>0]
  bestfautures
}