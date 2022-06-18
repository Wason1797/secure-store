resource "aws_security_group" "secure_store_alb_sg" {
  count       = var.create_module
  name        = "secure-store${var.env}-alb-sg"
  description = "Default SG for the load balancer"
  vpc_id      = var.vpc_id

  ingress {
    from_port = "0"
    to_port   = "0"
    protocol  = "-1"
    self      = true
  }

  egress {
    from_port = "0"
    to_port   = "0"
    protocol  = "-1"
    self      = "true"
  }

  tags = {
    Environment = "${var.env}"
  }
}


resource "aws_lb" "secure_store_alb" {
  count              = var.create_module
  name               = "secure-store-alb"
  internal           = true
  load_balancer_type = "application"
  security_groups    = [aws_security_group.secure_store_alb_sg[count.index].id]
  idle_timeout       = 60
  subnets            = [element(var.subnet.*.id, 0), element(var.subnet.*.id, 1)]
}

resource "aws_lb_target_group" "secure_store_alb_target_group" {
  count       = var.create_module
  name        = "backend-tg"
  port        = 5000
  protocol    = "HTTP"
  target_type = "instance"
  vpc_id      = var.vpc_id

  health_check {
    enabled  = true
    path     = "/"
    port     = "5000"
    protocol = "HTTP"
    interval = 90
    timeout  = 20
    matcher  = "200"
  }

  depends_on = [aws_lb.secure_store_alb]
}

resource "aws_lb_listener" "http" {
  count             = var.create_module
  load_balancer_arn = aws_lb.secure_store_alb[count.index].arn
  port              = "80"
  protocol          = "HTTP"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.secure_store_alb_target_group[count.index].arn

  }
}

resource "aws_lb_target_group_attachment" "one" {
  count            = var.create_module
  target_group_arn = aws_lb_target_group.secure_store_alb_target_group[count.index].arn
  target_id        = var.ec2_instance_id
  port             = 5000
}
