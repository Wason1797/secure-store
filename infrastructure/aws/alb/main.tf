resource "aws_security_group" "secure_store_alb_sg" {
  name        = "secure-store${var.env}-alb-sg"
  description = "Default SG for the load balancer"
  vpc_id      = var.vpc_id

  ingress {
    from_port       = "80"
    to_port         = "80"
    protocol        = "tcp"
    security_groups = ["sg-052b007f52d2031cb"]
  }

  egress {
    from_port   = "0"
    to_port     = "0"
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Environment = "${var.env}"
  }
}


resource "aws_lb" "secure_store_alb" {
  name               = "secure-store-alb"
  internal           = true
  load_balancer_type = "application"
  security_groups    = [aws_security_group.secure_store_alb_sg.id]
  idle_timeout       = 60
  subnets            = [element(var.subnet.*.id, 0), element(var.subnet.*.id, 1)]
}

resource "aws_lb_target_group" "secure_store_alb_target_group" {
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
  load_balancer_arn = aws_lb.secure_store_alb.arn
  port              = "80"
  protocol          = "HTTP"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.secure_store_alb_target_group.arn

  }
}

resource "aws_lb_target_group_attachment" "one" {
  target_group_arn = aws_lb_target_group.secure_store_alb_target_group.arn
  target_id        = var.ec2_instance_id
  port             = 5000
}


output "alb_sg_group_id" {
  value = aws_security_group.secure_store_alb_sg.id
}
